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

CSS Combinators – Quick Guide

CSS combinators define relationships between selectors.

1. Descendant Combinator ( )

Selects all matching elements inside a parent (any depth).

div p {
  color: blue;
}
<div>
  <section>
    <p>Selected</p>
  </section>
</div>
2. Child Combinator (>)

Selects only direct children.

div > p {
  color: red;
}
<div>
  <p>Selected</p>
  <section>
    <p>Not selected</p>
  </section>
</div>
3. Adjacent Sibling (+)

Selects the next immediate sibling.

h1 + p {
  color: green;
}
<h1>Title</h1>
<p>Selected</p>
<p>Not selected</p>
4. General Sibling (~)

Selects all following siblings.

h1 ~ p {
  color: purple;
}
<h1>Title</h1>
<p>Selected</p>
<p>Selected</p>
Summary Table
Combinator	Symbol	Description
Descendant	(space)	Any level inside
Child	>	Direct children only
Adjacent sibling	+	Next sibling only
General sibling	~	All following siblings