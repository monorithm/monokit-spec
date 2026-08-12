Avatar shows a person; with no `src` it shows the declared empty placeholder instead of inventing a face.

```jsx
<Avatar size={96} edit />
<Avatar size={32} src={user.photo} alt="Ama" />
```

Sizes are pixels: 32 in a list row, 40 in chrome, 96 or more when the avatar is the screen's subject. `edit` adds the emerald camera affordance for a photo-picking step — wrap the whole avatar in a Pressable to make it tappable.
