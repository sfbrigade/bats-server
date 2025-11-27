import './IconToggleButton.scss';

export default function IconToggleButton({ disabled, selected, selectedIcon, deselectedIcon, onClick }) {
  return (
    <button className="usa-button--unstyled icon-toggle-button" disabled={disabled} onClick={onClick}>
      {selected && selectedIcon}
      {!selected && deselectedIcon}
    </button>
  );
}
