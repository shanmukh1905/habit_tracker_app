<div 
  className="progress-bar"
  role="progressbar"
  aria-valuenow={goalProgress}
  aria-valuemin="0"
  aria-valuemax="100"
>
  <div 
    className="progress-fill"
    style={{ width: `${goalProgress}%` }}
  >
    {goalProgress}%
  </div>
</div> 