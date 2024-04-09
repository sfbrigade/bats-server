import classNames from 'classnames';

import './MciCounter.scss';

function MciCounter({ className, isEditable, label, name, onChange, type, value }) {
  function onBlur(event) {
    const newValue = parseInt(event.target.value, 10);
    if (isNaN(newValue)) {
      // trigger a state change to reset
      onChange({
        target: {
          name,
          value,
        },
      });
    }
  }

  function onChangeInternal(event) {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue)) {
      onChange({
        target: {
          name,
          value: newValue,
        },
      });
    }
  }

  function onIncrement() {
    onChange({
      target: {
        name,
        value: (value ?? -1) + 1,
      },
    });
  }

  function onDecrement() {
    const newValue = (value ?? 1) - 1;
    if (newValue >= 0) {
      onChange({
        target: {
          name,
          value: newValue,
        },
      });
    }
  }

  return (
    <div className={classNames('mci-counter', `mci-counter--${type}`, className)}>
      {isEditable && (
        <button onClick={onDecrement} className="mci-counter__button" tabIndex={-1}>
          -
        </button>
      )}
      <div className="mci-counter__control">
        <div className="mci-counter__label">{label}</div>
        <input
          disabled={!isEditable}
          readOnly={!isEditable}
          type="number"
          className="mci-counter__input"
          value={value ?? ''}
          onBlur={onBlur}
          onChange={onChangeInternal}
        />
      </div>
      {isEditable && (
        <button onClick={onIncrement} className="mci-counter__button" tabIndex={-1}>
          +
        </button>
      )}
    </div>
  );
}

export default MciCounter;
