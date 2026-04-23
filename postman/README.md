# BoatListr Postman Testing

## Import Files
1. Import `postman/BoatListr-APIs.postman_collection.json` into Postman.
2. Import `postman/BoatListr.local.postman_environment.json` into Postman.
3. Select the `BoatListr Local` environment.

## Required Setup
1. Start app: `npm run dev`
2. Ensure database is reachable through `DATABASE_URL`.
3. Create at least one user using `Auth -> Register`.
4. Run `Auth -> Login` and copy the returned token into environment variable `token`.

## Suggested Test Order
1. Auth
2. Users
3. Listings
4. Favorites
5. Conversations
6. Notifications
7. Payments
8. Subscriptions
9. Upload
10. Admin (only with admin role token)

## Webhook Signature for Postman
If `STRIPE_WEBHOOK_SECRET` is set, generate `x-webhook-signature` as hex HMAC-SHA256 of the exact raw JSON body.

PowerShell example:

```powershell
$secret = "your_webhook_secret"
$body = Get-Content -Raw "payload.json"
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [Text.Encoding]::UTF8.GetBytes($secret)
$hash = $hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes($body))
([System.BitConverter]::ToString($hash) -replace '-', '').ToLower()
```

Put the generated value into environment variable `webhookSignature`.

## Notes
- Protected routes require `Authorization: Bearer {{token}}`.
- Use IDs returned from API responses to update `userId`, `listingId`, `conversationId`, `mediaId`, and `notificationId` in environment variables.
