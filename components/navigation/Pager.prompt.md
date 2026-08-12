Pager is a real swipe — the track follows the finger and settles on the spatial spring.

```jsx
<Pager index={i} onIndexChange={setI}>
  <IntroPane ... />
  <IntroPane ... />
</Pager>
```

Past the first or last pane it rubber-bands at `interaction.gestures.rubberBand` damping instead of stopping dead. A drag past 30% of the width, or a release above 700 px/s, commits; anything shorter snaps back. Pair it with PageDots and put the Pager inside a `scroll={false}` Screen.
