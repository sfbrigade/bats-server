import classNames from 'classnames';

import './IconToggleButton.scss';

export default function IconToggleButton({ className, disabled, selected, selectedIcon, deselectedIcon, onClick }) {
  return (
    <button className={classNames('usa-button--unstyled icon-toggle-button', className)} disabled={disabled} onClick={onClick}>
      {selected && selectedIcon}
      {!selected && deselectedIcon}
    </button>
  );
}
