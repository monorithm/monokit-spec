InputOtp is the OTP step: six cells, autofocused, submitting itself on the last digit.

```jsx
<InputOtp autoFocus value={code} onChange={setCode} invalid={wrong} onComplete={verify} />
```

Never pair it with a Continue button as the only way forward — `onComplete` submits. On a wrong code set `invalid`, keep the digits on screen, and put the recovery sentence in the Field. Resend is deterministic text ("Resend in 0:42"), then a `plain` Button.
