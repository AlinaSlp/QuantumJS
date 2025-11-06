// IMPORTS
import { header, burgerButton, closeButton, closeButtonTab } from './refs';

// EVENT LISTENERS

header.addEventListener('click', toggleNavMenu);

// RENDER
export function toggleNavMenu(event) {
  if (burgerButton.contains(event.target)) {
    header.classList.add('menu-open');
  } else if (
    closeButton.contains(event.target) ||
    closeButtonTab.contains(event.target)
  ) {
    header.classList.remove('menu-open');
  } else {
    return;
  }
}
