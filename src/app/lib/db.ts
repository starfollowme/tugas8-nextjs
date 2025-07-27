import { prisma } from './prisma';

import { User, Article } from '@prisma/client';


export const userService = {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email }
    });
  },

  async create(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return await prisma.user.create({
      data: userData
    });
  },

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id }
    });
  }
};

export const articleService = {
  async getPublicArticles(): Promise<Article[]> {
    return await prisma.article.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    });
  },

  async getUserArticles(authorId: string): Promise<Article[]> {
    return await prisma.article.findMany({
      where: { authorId },
      orderBy: { createdAt: "desc" }
    });
  },

  async create(articleData: {
    title: string;
    content?: string;
    summary?: string;
    status?: string;
    authorId: string;
  }): Promise<Article> {
    return await prisma.article.create({
      data: articleData
    });
  },

  async getStats(authorId: string) {
    const articles = await prisma.article.findMany({
      where: { authorId }
    });

    const totalArticles = articles.length;
    const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
    const draftCount = articles.filter(article => article.status === 'draft').length;

    return {
      totalArticles,
      totalViews,
      draftCount
    };
  }
};