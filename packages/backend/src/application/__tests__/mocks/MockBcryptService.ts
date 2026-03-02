export class MockBcryptService {
    private saltRounds = 10;

    async hash(password: string): Promise<string> {
        // Simple mock hash - adds prefix to make it identifiable
        return `$2b$10$mocked_hash_${password}`;
    }

    async compare(password: string, hash: string): Promise<boolean> {
        // Simple mock compare
        return hash === `$2b$10$mocked_hash_${password}`;
    }
}
