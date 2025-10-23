import { redirect } from 'next/navigation';

export default function RepositoryPage({ params }: { params: { repoId: string } }) {
  redirect(`/docs/${params.repoId}`);
}
