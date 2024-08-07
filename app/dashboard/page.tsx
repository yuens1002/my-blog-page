import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScatterChart } from 'lucide-react';
import PageHeading from '@/components/PageHeading';

export default async function Dashboard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <>
      <h2 className="text-muted-foreground indent-1">
        Hello,{' '}
        <span className="capitalize">
          {user?.given_name || 'there'}
        </span>
      </h2>
      <PageHeading>Dashboard</PageHeading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-5xl">10</CardTitle>
            <CardDescription>Posts Published</CardDescription>
          </CardHeader>
          <CardContent className="prose">
            <h5>
              <strong>Last Posted</strong>
            </h5>
            <h6 className="text-muted-foreground text-sm">
              7/01/2024
            </h6>
            <h5 className="mt-6">
              <strong>0</strong>
            </h5>
            <h6 className="text-muted-foreground text-sm">
              Post in Draft
            </h6>
          </CardContent>
          <CardFooter className="flex-col justify-end gap-3 grow items-stretch lg:flex-row lg:items-end lg:justify-between">
            <Button variant={'outline'}>Edit a Post</Button>
            <Button>Start a New Post</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-5xl">20</CardTitle>
            <CardDescription>People Liked Your Posts</CardDescription>
          </CardHeader>
          <CardContent className="prose">
            <h5>
              <strong>2</strong>
            </h5>
            <h6 className="text-muted-foreground text-sm">
              Disliked
            </h6>
            <p className="font-bold">Top 3 Liked Posts</p>
            <ul className="list-outside">
              <li>So here is the first item in this list.</li>
              <li>{`In this example we're keeping the items short.`}</li>
              <li>
                {`Later, we'll use longer, more complex list items.`}
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-5xl">9999</CardTitle>
            <CardDescription>
              Unique Visits to Your Posts
            </CardDescription>
          </CardHeader>
          <CardContent className="prose">
            <p className="font-bold">
              Top 5 Countries/Territories Where Visitors Come From
            </p>
            <ul className="list-outside">
              <li>United States</li>
              <li>Canada</li>
              <li>Hong Kong</li>
              <li>Finland</li>
              <li>Germany</li>
              <li>Spain</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant={'link'}>
              <ScatterChart className="mr-2 h-4 w-4" />
              See More SEO Stats
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
