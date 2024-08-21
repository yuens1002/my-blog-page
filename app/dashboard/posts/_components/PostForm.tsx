import { useState, useRef, FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

import { Textarea } from '@/components/ui/textarea';
import ImageOptionTabs from '../new/_components/image-upload/ImageOptionTabs';
import CategoryField from '../new/_components/category-field/CategoryField';
import {
  createPost,
  PostResult,
  updatePost,
} from '@/app/dashboard/_actions/managePosts';
import UnsplashOption from '../new/_components/image-upload/UnsplashOption';
import ImageUploadOption from '../new/_components/image-upload/ImageUploadOption';
import { FormSubmitAction, InitialFormState } from '@/lib/types';
import SubmitButton from '@/components/SubmitButton';
import { usePostContext } from '@/app/dashboard/_hooks/usePostContext';
import AddTagsField from '../new/_components/create-tags/AddTagsField';
import type { PostWithRelations } from '@/prisma/generated/zod';

export default function PostForm() {
  const { toast } = useToast();
  const [
    {
      createCategoryInput,
      addTagInput,
      imageOption,
      photoId,
      photoProps,
      postData,
    },
    dispatch,
  ] = usePostContext();

  const titleInput = useRef<HTMLInputElement>(null);
  const contentInput = useRef<HTMLTextAreaElement>(null);

  //prettier ignore
  const [submitAction, setSubmitAction] = useState<
    FormSubmitAction | ''
  >('');
  const [isPending, setIsPending] = useState(false);

  const resetForm = () => {
    dispatch({ type: 'RESET' });
    setSubmitAction('');
    titleInput.current && (titleInput.current.value = '');
    contentInput.current && (contentInput.current.value = '');
  };

  const errors = {
    unsplashPhotoId:
      'Click the Preview button to confirm photo id is valid',
    createCategoryInput: `You have entered "${createCategoryInput}" as a new category, click the Create button to confirm`,
    addTagInput: `You have entered "${addTagInput}" as a new tag, click the Add button to confirm`,
  };

  const isImageInputValid = () => {
    console.log('🚀 ~ isImageInputValid ~ imageOption:', imageOption);
    let isImageValid = false;
    if (imageOption === 'upload') {
      isImageValid = true;
    } else if (!photoId || (photoId && photoProps)) {
      isImageValid = true;
    }
    return isImageValid;
  };

  const areInputsValid = () => {
    console.log('🚀 ~ areInputsValid ~ !addTagInput:', !addTagInput);
    console.log(
      '🚀 ~ areInputsValid ~ !createCategoryInput:',
      !createCategoryInput
    );
    console.log(
      '🚀 ~ areInputsValid ~ isImageInputValid():',
      isImageInputValid()
    );
    console.log(
      '🚀 ~ areInputsValid ~ Boolean ',
      Boolean(
        isImageInputValid() && !createCategoryInput && !addTagInput
      )
    );
    return Boolean(
      isImageInputValid() && !createCategoryInput && !addTagInput
    );
  };

  const createToast = (title: string, type: keyof typeof errors) => {
    return {
      title: `Unconfirmed ${title}`,
      description: errors[type],
      duration: 6000,
    };
  };

  const handleInputError = () => {
    if (imageOption === 'unsplash' && !photoProps && photoId) {
      toast(createToast('Unsplash Photo ID', 'unsplashPhotoId'));
    }
    if (createCategoryInput) {
      toast(createToast('Category Input', 'createCategoryInput'));
    }
    if (addTagInput) {
      toast(createToast('Tag Input', 'addTagInput'));
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.target as HTMLFormElement);
    if (!areInputsValid()) {
      setIsPending(false);
      handleInputError();
      return;
    }

    console.log('🚀 ~ NewPostForm ~ formData:', formData);
    console.log('🚀 ~ NewPostForm ~ submitAction:', submitAction);

    switch (submitAction) {
      case 'PUBLISH':
        formData.append('isPublished', true.toString());
        formData.append('status', 'PUBLISHED');
        submitForm(createPost);
        break;
      case 'DRAFT':
        formData.append('status', 'DRAFT');
        submitForm(createPost);
        break;
      case 'UPDATE':
        formData.append('status', 'DRAFT');
        if (postData) {
          const updatePostWithPostData = updatePost.bind(null, {
            postId: postData.id,
            authorId: postData.authorId,
          });
          submitForm(updatePostWithPostData);
        }
        break;
      default:
        toast({ description: "Can't submit form, try again later" });
    }

    async function submitForm(
      formAction: (formData: FormData) => Promise<PostResult>
    ) {
      const { status, message, data } = (await formAction(
        formData
      )) as InitialFormState;
      console.log(
        '🚀 ~ useEffect ~ message, status:',
        message,
        status
      );
      setIsPending(false);
      if (typeof message === 'string') {
        toast({ description: message });
        if (status === 'ok') {
          if (submitAction === 'PUBLISH') {
            resetForm();
          } else if (data) {
            dispatch({ type: 'SET_POST_DATA', payload: data });
          }
        }
      } else {
        Object.entries(message).forEach(([key, value]) => {
          toast({
            title: key,
            description: value.join(', '),
          });
        });
      }
    }
  };

  return (
    <form className="block space-y-10" onSubmit={handleFormSubmit}>
      <div className="mt-12 space-y-2">
        <Label htmlFor="title" className="text-lg">
          Title*
        </Label>
        <Input
          defaultValue={postData?.title}
          ref={titleInput}
          placeholder="ie. The Art of Peace"
          type="text"
          id="title"
          name="title"
          maxLength={256}
          minLength={10}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content" className="text-lg">
          Content
        </Label>
        <Textarea
          defaultValue={postData?.content ?? undefined}
          ref={contentInput}
          placeholder="10,000 characters limit"
          id="content"
          name="content"
          maxLength={10000}
          minLength={20}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <div className="grid grid-cols-1 gap-8 md:gap-16">
          <div>
            <CategoryField />
          </div>
          <div>
            <AddTagsField />
          </div>
        </div>
        <ImageOptionTabs>
          {imageOption === 'upload' ? (
            <ImageUploadOption />
          ) : (
            <UnsplashOption />
          )}
        </ImageOptionTabs>
        <div className="md:col-span-2">
          <div className="flex justify-between items-center gap-4">
            <p className="text-sm">*Required fields</p>
            <div className="flex justify-end gap-4">
              <SubmitButton
                aria-disabled={isPending}
                showLoader={
                  isPending &&
                  (submitAction === 'DRAFT' ||
                    submitAction === 'UPDATE')
                }
                onClick={() =>
                  postData
                    ? setSubmitAction('UPDATE')
                    : setSubmitAction('DRAFT')
                }
                variant="outline"
              >
                {postData ? 'Update' : 'Save'}{' '}
                {postData ? 'Edits' : 'Draft'}
              </SubmitButton>
              <SubmitButton
                aria-disabled={isPending}
                showLoader={isPending && submitAction === 'PUBLISH'}
                onClick={() => setSubmitAction('PUBLISH')}
              >
                Publish
              </SubmitButton>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
