# View Transition
<ViewTransition> lets you animate elements that update inside a Transition.
import {ViewTransition} from 'react';

<ViewTransition>
  <div>...</div>
</ViewTransition>
By default, <ViewTransition> animates with a smooth cross-fade (the browser default view transition). You can customize the animation by providing a View Transition Class to the <ViewTransition> component. 
<ViewTransition enter="slide-in">
/* Remove default animation */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
}

/* Custom fade out */
::view-transition-old(root) {
  animation: fadeOut 200ms ease forwards;
}

/* Custom fade in */
::view-transition-new(root) {
  animation: fadeIn 400ms ease forwards;
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
}

It needs to be warpped inside startTransition to activate
<button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >
      </button>

# Flexbox Vs Grid
applies uniforms width
flex: 1
grid-template-columns: 1fr 1fr 1fr //No of columns
makes the element take up additional space
flex-grow: 1 
grid-template-rows: auto 1fr auto //
Move ekement to next line based on width - This is complicated in grid
flex-wrap: wrap
| Scenario             | Use     |
| -------------------- | ------- |
| Align items in a row | Flexbox |
| Center something     | Flexbox |
| Full page layout     | Grid    |
| Card gallery         | Grid    |
| Navigation bar       | Flexbox |
| Dashboard layout     | Grid    |
Can Flexbox replace Grid?
→ Technically yes, but messy for 2D layouts.
Can Grid replace Flexbox?
→ Yes, but Flexbox is simpler for 1D alignment.
Best answer:
“Grid handles layout structure, Flexbox handles component alignment.”