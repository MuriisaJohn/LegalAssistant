import { 
  User, InsertUser, 
  Message, InsertMessage, 
  LegalContext, InsertLegalContext 
} from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';

// Modify the interface with any CRUD methods you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByConversationId(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Legal context operations
  getLegalContext(id: number): Promise<LegalContext | undefined>;
  getAllLegalContexts(): Promise<LegalContext[]>;
  createLegalContext(context: InsertLegalContext): Promise<LegalContext>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private legalContexts: Map<number, LegalContext>;
  
  private userIdCounter: number;
  private messageIdCounter: number;
  private legalContextIdCounter: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.legalContexts = new Map();
    
    this.userIdCounter = 1;
    this.messageIdCounter = 1;
    this.legalContextIdCounter = 1;
    
    // Initialize with default legal contexts
    this.initializeLegalContexts();
  }

  private initializeLegalContexts() {
    const defaultContexts: InsertLegalContext[] = [
      {
        title: "Constitution of Uganda",
        content: "The Constitution of Uganda is the supreme law of Uganda. The current constitution was adopted on October 8, 1995. It provides the legal and governmental framework for the country."
      },
      {
        title: "Land Act of Uganda",
        content: "The Land Act of Uganda, enacted in 1998, provides for the tenure, ownership and management of land. It recognizes four forms of land tenure: Customary, Freehold, Mailo, and Leasehold."
      },
      {
        title: "Employment Act 2006",
        content: "The Employment Act 2006 is the principal legislation governing employment relationships in Uganda. It sets out the rights and duties of employers and employees."
      },
      {
        title: "Companies Act 2012",
        content: "The Companies Act 2012 provides for the incorporation, regulation, and administration of companies in Uganda."
      },
      {
        title: "Evidence Act",
        content: "The Evidence Act (Cap 6) governs the admissibility of evidence in legal proceedings in Uganda."
      },
      {
        title: "Children Act",
        content: "The Children Act (Cap 59) provides for the care, protection, and maintenance of children in Uganda."
      }
    ];

    defaultContexts.forEach(context => {
      this.createLegalContext(context);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: now
    };
    this.messages.set(id, message);
    return message;
  }

  // Legal context methods
  async getLegalContext(id: number): Promise<LegalContext | undefined> {
    return this.legalContexts.get(id);
  }

  async getAllLegalContexts(): Promise<LegalContext[]> {
    return Array.from(this.legalContexts.values());
  }

  async createLegalContext(insertLegalContext: InsertLegalContext): Promise<LegalContext> {
    const id = this.legalContextIdCounter++;
    const legalContext: LegalContext = { ...insertLegalContext, id };
    this.legalContexts.set(id, legalContext);
    return legalContext;
  }
}

export const storage = new MemStorage();
