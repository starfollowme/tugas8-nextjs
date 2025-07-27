import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { articleService } from '@/app/lib/db';
import { z } from 'zod';

const articleSchema = z.object({
  title: z.string().min(1, { message: 'Judul tidak boleh kosong.' }).max(255),
  content: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Tidak diotorisasi' }, { status: 401 });
    }

    const json = await request.json();
    const parsedData = articleSchema.safeParse(json);

    if (!parsedData.success) {
      return NextResponse.json({ message: parsedData.error.errors[0].message }, { status: 400 });
    }

    const { title, content, status } = parsedData.data;

    const articleData = {
      title,
      content: content || '',
      status,
      authorId: session.user.id,
    };

    const newArticle = await articleService.create(articleData);

    return NextResponse.json(newArticle, { status: 201 });

  } catch (error) {
    console.error('Gagal membuat artikel:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Request body tidak valid.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Terjadi kesalahan internal pada server.' }, { status: 500 });
  }
}
