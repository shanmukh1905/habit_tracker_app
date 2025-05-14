from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
from typing import List
import uuid
from pymongo import MongoClient
import json
from bson import ObjectId
import os

# Custom JSON encoder for MongoDB ObjectId
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

app = Flask(__name__)
CORS(app)
app.json_encoder = MongoJSONEncoder

# MongoDB Connection
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)
db = client.habit_tracker
habits_collection = db.habits
completions_collection = db.completions

def calculate_streak(completions: List[str]) -> int:
    if not completions:
        return 0
    try:
        today = datetime.now().date()
        dates = [datetime.strptime(date, '%Y-%m-%d').date() for date in completions]
        dates.sort(reverse=True)
        streak = 0
        current_date = today
        for date in dates:
            if date == current_date:
                streak += 1
                current_date -= timedelta(days=1)
            else:
                break
        return streak
    except Exception as e:
        print(f"Error calculating streak: {str(e)}")
        return 0

@app.route('/api/habits', methods=['GET'])
def get_habits():
    try:
        habits = list(habits_collection.find())
        habits_with_completions = []
        for habit in habits:
            habit_id = habit['id']
            habit.pop('_id', None)
            completion_doc = completions_collection.find_one({'habit_id': habit_id})
            habit_completions = completion_doc['dates'] if completion_doc else []
            streak = calculate_streak(habit_completions)
            habits_with_completions.append({
                **habit,
                'completions': habit_completions,
                'streak': streak,
                'lastCompleted': habit_completions[-1] if habit_completions else None
            })
        return jsonify({'success': True, 'data': habits_with_completions})
    except Exception as e:
        print(f"Error in get_habits: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/habits', methods=['POST'])
def add_habit():
    try:
        data = request.get_json()
        if not data or 'name' not in data:
            return jsonify({'success': False, 'error': 'Name is required'}), 400
        new_habit = {
            'id': str(uuid.uuid4()),
            'name': data['name'],
            'createdAt': datetime.now().strftime('%Y-%m-%d')
        }
        habits_collection.insert_one(new_habit)
        response_habit = {
            **new_habit,
            'completions': [],
            'streak': 0,
            'lastCompleted': None
        }
        return jsonify({'success': True, 'data': response_habit})
    except Exception as e:
        print(f"Error in add_habit: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/habits/<string:habit_id>', methods=['DELETE'])
def delete_habit(habit_id):
    try:
        result = habits_collection.delete_one({'id': habit_id})
        if result.deleted_count == 0:
            return jsonify({'success': False, 'error': 'Habit not found'}), 404
        completions_collection.delete_one({'habit_id': habit_id})
        return jsonify({'success': True, 'message': 'Habit deleted successfully'})
    except Exception as e:
        print(f"Error in delete_habit: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/habits/<string:habit_id>/toggle', methods=['POST'])
def toggle_habit(habit_id):
    try:
        today = datetime.now().strftime('%Y-%m-%d')
        habit = habits_collection.find_one({'id': habit_id})
        if not habit:
            return jsonify({'success': False, 'error': 'Habit not found'}), 404
        habit.pop('_id', None)
        completion_doc = completions_collection.find_one({'habit_id': habit_id})
        if completion_doc:
            habit_completions = completion_doc['dates']
            if today in habit_completions:
                completions_collection.update_one(
                    {'habit_id': habit_id},
                    {'$pull': {'dates': today}}
                )
                habit_completions.remove(today)
            else:
                completions_collection.update_one(
                    {'habit_id': habit_id},
                    {'$push': {'dates': today}}
                )
                habit_completions.append(today)
        else:
            habit_completions = [today]
            completions_collection.insert_one({
                'habit_id': habit_id,
                'dates': habit_completions
            })
        streak = calculate_streak(habit_completions)
        return jsonify({
            'success': True,
            'data': {
                **habit,
                'completions': habit_completions,
                'streak': streak,
                'lastCompleted': habit_completions[-1] if habit_completions else None
            }
        })
    except Exception as e:
        print(f"Error in toggle_habit: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
X