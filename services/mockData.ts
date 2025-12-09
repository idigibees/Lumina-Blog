import { User, BlogPost, UserRole } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@lumina.com',
    role: UserRole.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    earnings: 1250.50,
  },
  {
    id: 'author-1',
    name: 'Sarah Jenkins',
    email: 'sarah@writer.com',
    role: UserRole.AUTHOR,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    earnings: 340.20,
  },
  {
    id: 'author-2',
    name: 'David Chen',
    email: 'david@tech.com',
    role: UserRole.AUTHOR,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    earnings: 89.50,
  },
];

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Future of Web Development in 2025',
    excerpt: 'Exploring the latest trends in frontend frameworks, AI integration, and edge computing.',
    content: `
# The Future is Here

Web development is evolving at a breakneck pace. With the advent of powerful AI tools and edge computing, the way we build and deploy applications is changing fundamentally.

## AI-Driven Development

It is no longer just about writing code; it is about orchestrating intelligence. Developers are now leveraging LLMs to generate boilerplate, optimize algorithms, and even design UI components on the fly.

## The Edge

Edge computing brings the server closer to the user, reducing latency and improving the overall user experience. This is crucial for real-time applications and high-frequency trading platforms.

### Conclusion

To stay relevant, developers must adapt to these changes. Continuous learning is the key.
    `,
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    authorId: 'author-1',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    views: 1240,
    likes: 45,
    tags: ['Tech', 'Development', 'Future'],
    published: true,
    comments: [
        {
            id: 'c1',
            authorId: 'reader-1',
            authorName: 'Alex Reader',
            content: 'Great insights! AI is definitely changing the game.',
            createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
        }
    ],
  },
  {
    id: 'post-2',
    title: '10 Tips for Minimalist Living',
    excerpt: 'How to declutter your life and focus on what truly matters.',
    content: 'Minimalism is not just about having less stuff; it is about making room for more of what matters...',
    coverImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80',
    authorId: 'author-2',
    authorName: 'David Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    views: 850,
    likes: 128,
    tags: ['Lifestyle', 'Minimalism'],
    published: true,
    comments: [],
  },
  {
    id: 'post-3',
    title: 'Understanding Quantum Computing',
    excerpt: 'A beginner-friendly guide to qubits, superposition, and entanglement.',
    content: 'Quantum computing harnesses the phenomena of quantum mechanics to deliver a huge leap forward in computation...',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    authorId: 'author-1',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    views: 2100,
    likes: 342,
    tags: ['Science', 'Tech'],
    published: true,
    comments: [],
  },
];