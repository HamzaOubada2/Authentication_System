┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│      users      │        │      roles      │        │   permissions   │
├─────────────────┤        ├─────────────────┤        ├─────────────────┤
│ id              │        │ id              │        │ id              │
│ email           │──────▶ │ name            │──────▶ │ name            │
│ password        │  M:M   │ description     │  M:M   │ description     │
│ isVerified      │        └─────────────────┘        └─────────────────┘
│ refreshToken    │
│ resetToken      │
│ resetTokenExp   │
│ verifyToken     │
│ createdAt       │
└─────────────────┘