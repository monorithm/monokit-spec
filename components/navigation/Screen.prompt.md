Screen is the frame every native surface starts from — chrome, scrolling content, committed action.

```jsx
<Screen header={<ScreenHeader title="Verify" onBack={back} steps={{ total: 5, done: 3 }} />}
        footer={<Button size="cta" block onPress={next}>Continue</Button>}>
  ...
</Screen>
```

Set `padded={false}` when the content is a full-bleed ListGroup or media. Set `scroll={false}` for a Pager or camera. Only the content region scrolls — never the screen, and never the body.
