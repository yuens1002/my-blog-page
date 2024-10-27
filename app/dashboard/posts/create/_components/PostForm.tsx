import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { type PostFormState } from '../../types';

type PostFormProps = {
  defaultValues: PostFormState;
  schema: z.ZodObject<any, any>;
};

export default function PostForm({
  defaultValues,
  schema,
}: PostFormProps) {
  const { toast } = useToast();
  const form = useForm<PostFormState>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // function onSubmit(data: PostFormState>) {
  //   console.log('🚀 ~ onSubmit ~ data:', data);
  //   // Do something with the form values.
  //   // ✅ This will be type-safe and validated.
  //   toast({
  //     title: 'You submitted the following values:',
  //     description: (
  //       <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //         <code className="text-white">
  //           {JSON.stringify(data, null, 2)}
  //         </code>
  //       </pre>
  //     ),
  //   });
  // }

  // const handleSubmit = (values: z.infer<typeof postFormSchema>) => {

  //   console.log('🚀 ~ handleSubmit ~ values:', values);
  // };

  const onSubmit: SubmitHandler<PostFormState> = (data) =>
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      ),
    });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid lg:grid-cols-2 lg:gap-x-8"
      >
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Text fields</CardTitle>
            <CardDescription>
              Lipsum dolor sit amet, consectetur adipiscing elit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter post title"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {schema.shape.title.description}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter an excerpt for your post here"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Min of 50 to 200 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter some content for your post here"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Min of 10 to 1000 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Choose one or more categories for the post or add new
              ones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">
                        Blueberry
                      </SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">
                        Pineapple
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Add one or more tags for the post
            </CardDescription>
          </CardHeader>
        </Card> */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
