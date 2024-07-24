'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';
import { CreatePost } from '../../_actions/managePosts';

export default function NewPostForm() {
  return (
    <form className="space-y-10">
      <div className="mt-12 space-y-2">
        <Label htmlFor="title" className="text-lg">
          Title*
        </Label>
        <Input
          placeholder="ie. The Art of Peace"
          type="text"
          id="title"
          name="title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content" className="text-lg">
          Content*
        </Label>
        <Textarea
          placeholder="10,000 max characters"
          id="content"
          name="content"
          maxLength={10000}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image" className="text-lg">
          Upload an Image*
        </Label>
        <Input type="file" id="image" name="imageFile" required />
      </div>
      <div className="flex justify-between items-center gap-4 pt-12">
        <p>*all required fields</p>
        <div className="flex justify-end gap-4">
          <Button variant={'outline'}>Save Draft</Button>
          <Button formAction={CreatePost}>Publish</Button>
        </div>
      </div>
    </form>
  );
}
