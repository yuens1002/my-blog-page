import { useState, useRef, useEffect, type FormEvent } from 'react';
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
import { FormSubmitAction } from '@/lib/types';
import SubmitButton from '@/components/SubmitButton';
import { usePostContext } from '@/app/dashboard/_hooks/usePostContext';
import AddTagsField from '../new/_components/create-tags/AddTagsField';
import { Category, Post } from '@prisma/client';
import { useRouter } from 'next/navigation';

type PostFormProps = {
  postData?: Post & { categories: Category[] };
};

export default function PostForm({ postData }: PostFormProps) {
  const route = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [
    {
      title,
      content,
      createCategoryInput,
      addTagInput,
      imageOption,
      photoId,
      photoProps,
    },
    dispatch,
  ] = usePostContext();

  const [formResult, setFormResult] = useState<
    (Post & { categories: Category[] }) | null
  >(null);

  //prettier ignore
  const [submitAction, setSubmitAction] = useState<
    FormSubmitAction | ''
  >('');
  const [isPending, setIsPending] = useState(false);

  const resetForm = () => {
    dispatch({ type: 'RESET' });
    setSubmitAction('');
    setFormResult(null);
    fileInputRef.current?.value && (fileInputRef.current.value = '');
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
    const shouldDeleteImage = Boolean(
      (formData.get('imageFile') instanceof File ||
        photoId ||
        // accounts for when the user wants to delete an uploaded image
        !fileInputRef?.current?.value) &&
        // accounts for when an image had been uploaded
        formResult?.imageURL
    );

    console.log(
      '🚀 ~ PostForm ~ formData ~ imageURL:',
      formData.get('imageURL')
    );
    console.log('🚀 ~ PostForm ~ submitAction:', submitAction);

    switch (submitAction) {
      case 'PUBLISH':
        formData.append('status', 'PUBLISHED');
        if (formResult) {
          console.log(
            '🚀 ~ handleFormSubmit ~ shouldDeleteImage:',
            shouldDeleteImage
          );
          const updatePostWithFormResult = updatePost.bind(null, {
            postId: formResult.id,
            authorId: formResult.authorId,
            imageURL: shouldDeleteImage ? formResult.imageURL : null,
            prevStatus: formResult.status,
          });
          submitForm(updatePostWithFormResult);
        } else submitForm(createPost);
        break;
      case 'DRAFT':
        formData.append('status', 'DRAFT');
        submitForm(createPost);
        break;
      case 'UPDATE':
        // update can be both a draft or a published post
        // draft and published posts use different zod schemas for validation
        const status = formResult?.status;
        formData.append('status', status ?? 'DRAFT');
        // deleting an already uploaded image should happen if:
        // a. the user chooses to upload a new image
        // b. the user chooses to provide an unsplash photoId
        // c. the user chooses to undo the uploaded image and left the file input empty
        // c. if a, b, or c is true and imageURL exists, it means an image had been uploaded and it needs to be deleted

        console.log(
          '🚀 ~ handleFormSubmit ~ shouldDeleteImage:',
          shouldDeleteImage
        );
        if (formResult) {
          const updatePostWithFormResult = updatePost.bind(null, {
            postId: formResult.id,
            authorId: formResult.authorId,
            imageURL: shouldDeleteImage ? formResult.imageURL : null,
            prevStatus: formResult.status,
          });
          submitForm(updatePostWithFormResult);
        }
        break;
      default:
        toast({ description: "Can't submit form, try again later" });
    }

    async function submitForm(
      formAction: (formData: FormData) => Promise<PostResult>
    ) {
      const { status, message, data } = await formAction(formData);
      console.log(
        '🚀 ~ submitForm ~ message, status:',
        message,
        status
      );
      setIsPending(false);
      if (typeof message === 'string') {
        toast({ description: message });
        if (status === 'ok' && data) {
          if (submitAction === 'PUBLISH') {
            resetForm();
          } else {
            route.push(`/dashboard/posts/${data.id}`);
          }
        }
      } else {
        Object.entries(message).forEach(([key, value]) => {
          if (value instanceof Array && value.length > 0) {
            toast({
              title: key,
              description: value.join(', '),
            });
          }
        });
      }
    }
  };

  useEffect(() => {
    postData && setFormResult(postData);
  }, [postData]);

  return (
    <form className="block space-y-10" onSubmit={handleFormSubmit}>
      <div className="mt-12 space-y-2">
        <Label htmlFor="title" className="text-lg">
          Title*
        </Label>
        <Input
          value={title}
          placeholder="ie. The Art of Peace"
          type="text"
          id="title"
          name="title"
          maxLength={256}
          minLength={10}
          required
          onChange={(e) =>
            dispatch({
              type: 'SET_STATE',
              payload: { stateProp: 'title', value: e.target.value },
            })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content" className="text-lg">
          Content
        </Label>
        <Textarea
          value={content}
          placeholder="10,000 characters limit"
          id="content"
          name="content"
          maxLength={10000}
          minLength={20}
          onChange={(e) =>
            dispatch({
              type: 'SET_STATE',
              payload: {
                stateProp: 'content',
                value: e.target.value,
              },
            })
          }
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
            <ImageUploadOption ref={fileInputRef} />
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
                  formResult
                    ? setSubmitAction('UPDATE')
                    : setSubmitAction('DRAFT')
                }
                variant="outline"
              >
                Save {formResult ? 'Changes' : 'Draft'}
              </SubmitButton>
              {formResult &&
              formResult.status === 'PUBLISHED' ? null : (
                <SubmitButton
                  aria-disabled={isPending}
                  showLoader={isPending && submitAction === 'PUBLISH'}
                  onClick={() => setSubmitAction('PUBLISH')}
                >
                  Publish
                </SubmitButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
