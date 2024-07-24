import PageHeading from '@/components/PageHeading';
import { Separator } from '@/components/ui/separator';
import UpsplashPhotoComp from '@/components/UpsplashPhotoComp';

require('dotenv').config({
  path: ['.env.local', '.env'],
});

type PostPageProps = {
  params: {
    slug: string;
  };
};

export default function CategoryPage({ params }: PostPageProps) {
  return (
    <>
      <article className="px-4 py-4 md:container md:py-8">
        <PageHeading>post title - {params.slug}</PageHeading>
        <h6 className="flex gap-4 pt-4 text-muted-foreground">
          <span>{`author's name`}</span>
          <span>
            <Separator orientation="vertical" />
          </span>
          <span>{`6 min read`}</span>
          <span>
            <Separator orientation="vertical" />
          </span>
          <span>{`written - 12/22/2024`}</span>
        </h6>
        <UpsplashPhotoComp photoId={'FGTCKmlAR8Q'} />
        <div className="md:columns-2 lg:columns-3 md:gap-6 lg:gap-8 py-12">
          <p className="prose first-letter:font-extrabold first-letter:text-8xl pb-4">{`His mother had always taught him not to ever think of himself as better than others. 
          He'd tried to live by this motto. He never looked down on those who were less 
          fortunate or who had less money than him. But the stupidity of the 
          group of people he was talking to made him change his mind.`}</p>
          <p className="prose pb-4">{`His mother had always taught him not to ever think of himself as better than others. 
          He'd tried to live by this motto. He never looked down on those who were less 
          fortunate or who had less money than him. But the stupidity of the 
          group of people he was talking to made him change his mind.`}</p>
          <p className="prose pb-4">{`His mother had always taught him not to ever think of himself as better than others. 
          He'd tried to live by this motto. He never looked`}</p>
        </div>
      </article>
    </>
  );
}
