# Appwrite Skill

Expert knowledge of Appwrite backend-as-a-service platform.

## Core Services

### Authentication
```typescript
import { Account } from 'appwrite'

// Email/Password auth
await account.create('unique-id', 'email@example.com', 'password', 'Name')
await account.createEmailSession('email@example.com', 'password')

// OAuth providers
await account.createOAuth2Session('google', success, failure)

// Anonymous sessions
await account.createAnonymousSession()
```

### Database
```typescript
import { Databases, ID, Query } from 'appwrite'

const databases = new Databases(client)

// Create document
await databases.createDocument(
  'database-id',
  'collection-id',
  ID.unique(),
  { title: 'Post', content: 'Content' }
)

// List documents with queries
await databases.listDocuments(
  'database-id',
  'collection-id',
  [
    Query.equal('status', 'published'),
    Query.orderDesc('$createdAt'),
    Query.limit(10)
  ]
)
```

### Storage
```typescript
import { Storage, ID } from 'appwrite'

const storage = new Storage(client)

// Upload file
await storage.createFile(
  'bucket-id',
  ID.unique(),
  file
)

// Get file preview
const url = storage.getFilePreview('bucket-id', 'file-id')

// Download file
const download = storage.getFileDownload('bucket-id', 'file-id')
```

### Functions
```typescript
// Execute cloud function
const execution = await functions.createExecution(
  'function-id',
  JSON.stringify({ data: 'payload' })
)
```

## Best Practices

### Client Configuration
```typescript
import { Client, Account, Databases } from 'appwrite'

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('project-id')

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
```

### Permission Management
```typescript
import { Permission, Role } from 'appwrite'

// Document permissions
const permissions = [
  Permission.read(Role.any()),                    // Anyone can read
  Permission.write(Role.user('user-id')),         // Specific user can write
  Permission.delete(Role.team('team-id')),        // Team can delete
  Permission.update(Role.users())                 // Any authenticated user
]
```

### Error Handling
```typescript
import { AppwriteException } from 'appwrite'

try {
  await account.create(ID.unique(), email, password, name)
} catch (error) {
  if (error instanceof AppwriteException) {
    if (error.code === 409) {
      // User already exists
    }
  }
}
```

## Database Design

### Collections Schema
```typescript
// Users collection attributes
{
  "name": { type: "string", size: 255, required: true },
  "bio": { type: "string", size: 1000, required: false },
  "avatar": { type: "string", size: 255, required: false },
  "role": { type: "enum", elements: ["user", "admin"], required: true }
}

// Indexes for performance
{
  "email": { type: "unique", attributes: ["email"] },
  "created": { type: "key", attributes: ["$createdAt"], orders: ["DESC"] }
}
```

### Relationships
```typescript
// One-to-Many: User has many Posts
// posts collection has userId attribute

// Query user's posts
await databases.listDocuments(
  'database-id',
  'posts',
  [Query.equal('userId', userId)]
)
```

## Security

### API Keys vs Sessions
- Use API keys for server-side operations
- Use sessions for client-side authentication
- Never expose API keys in frontend code
- Implement proper permission rules

### Input Validation
- Validate all user inputs
- Use Appwrite's built-in validators
- Implement rate limiting
- Sanitize data before storage

## Real-time Features

### Subscribe to Changes
```typescript
import { Client } from 'appwrite'

client.subscribe('databases.db-id.collections.posts.documents', response => {
  if (response.events.includes('databases.*.collections.*.documents.*.create')) {
    console.log('New document created:', response.payload)
  }
})
```

## Performance Optimization

### Caching Strategy
- Cache frequently accessed data
- Use Appwrite's built-in caching
- Implement client-side caching with React Query/SWR
- Set appropriate cache TTLs

### Query Optimization
- Use indexes for frequently queried fields
- Limit query results appropriately
- Use cursor pagination for large datasets
- Avoid fetching unnecessary attributes

## Migration & Backup

### Data Export
```bash
# Export database
appwrite databases export --database-id [ID]

# Export storage
appwrite storage export --bucket-id [ID]
```

### Version Management
- Use Appwrite CLI for migrations
- Version control schema changes
- Test migrations in development first
- Backup data before major changes
