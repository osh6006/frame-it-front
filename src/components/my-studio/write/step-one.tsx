'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChangeEvent, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  PortfolioImageFormValues,
  portfolioImageSchema,
} from '@/lib/schema/portfolio-regist-schema';
import { usePortfolioRegisterStore } from '@/store/portfolio-regist-store';

interface IStepOneProps {}

const StepOne: React.FunctionComponent<IStepOneProps> = () => {
  // zustand
  const nextStep = usePortfolioRegisterStore((state) => state.nextStep);

  const form = useForm<PortfolioImageFormValues>({
    resolver: zodResolver(portfolioImageSchema),
  });
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const onSubmit = (values: PortfolioImageFormValues) => {
    console.log(values);
    nextStep();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files: newFiles, displayUrls } = getImageData(e);

    if (previews.length + displayUrls.length > 10) {
      toast({
        title: '사진은 최대 10장까지 등록 가능해요!',
      });
      return;
    }

    // FileList를 명확하게 File[]로 변환
    const newFilesArray = Array.from(newFiles) as File[];

    setPreviews((prev) => [...prev, ...displayUrls]);
    setFiles((prev) => [...prev, ...newFilesArray]);
    form.setValue('images', [...files, ...newFilesArray]);
  };

  const handleRemoveImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    form.setValue('images', updatedFiles);
  };

  return (
    <section className="pb-[66px]">
      <h3 className="text-base font-semibold leading-[135%]">
        포트폴리오 사진을 첨부해 주세요
      </h3>
      <p className="text-sm leading-[150%] text-gray-40">
        최대 10장까지 등록 가능해요
      </p>

      {/* 미리보기 섹션 */}
      <div className="columns-1 space-y-[8px]">
        {previews.map((preview, index) => (
          <div key={index} className="relative w-full">
            <Image
              alt={`preview-${index}`}
              src={preview}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
              className="rounded-[8px]"
            />
            <button
              type="button"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 opacity-70"
              onClick={() => handleRemoveImage(index)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
              >
                <path
                  d="M4.00636 4.92808L1.13035 7.80232C1.00203 7.93071 0.846476 7.99343 0.663675 7.99048C0.480727 7.98768 0.325095 7.92215 0.19678 7.79391C0.0684654 7.66566 0.00430786 7.50871 0.00430786 7.32306C0.00430786 7.1374 0.0684654 6.98046 0.19678 6.85221L3.06416 3.98639L0.188364 1.13407C0.0599011 1.00582 -0.00285362 0.848871 9.95449e-05 0.663217C0.00290505 0.477712 0.0684654 0.320836 0.19678 0.19259C0.325095 0.0641968 0.48213 0 0.667884 0C0.853638 0 1.01067 0.0641968 1.13899 0.19259L4.00636 3.06683L6.86023 0.19259C6.98854 0.0641968 7.1441 0 7.3269 0C7.50985 0 7.66548 0.0641968 7.7938 0.19259C7.93126 0.329838 8 0.489001 8 0.67008C8 0.851158 7.93126 1.00582 7.7938 1.13407L4.92642 3.98639L7.80221 6.86084C7.93068 6.98909 7.99491 7.14456 7.99491 7.32726C7.99491 7.51011 7.93068 7.66566 7.80221 7.79391C7.66489 7.9313 7.50564 8 7.32446 8C7.14329 8 6.98854 7.9313 6.86023 7.79391L4.00636 4.92808Z"
                  fill="#201A17"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-[16px]">
          {files.length >= 10 ? null : (
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormControl>
                    <>
                      <FormLabel
                        htmlFor="images"
                        className="relative flex h-[328px] w-full cursor-pointer flex-col items-center justify-center rounded-[8px] border border-gray-60"
                      >
                        <PlusIcon size={32} className="text-gray-40" />
                        <Input
                          id="images"
                          accept="image/*"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </FormLabel>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[360px] bg-white px-[16px] py-[9px]">
            <Button
              type="submit"
              disabled={previews.length <= 0}
              className="w-full"
            >
              다음
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default StepOne;

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const dataTransfer = new DataTransfer();

  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image),
  );

  const files = dataTransfer.files;
  const displayUrls = Array.from(event.target.files!).map((file) =>
    URL.createObjectURL(file),
  );

  return { files, displayUrls };
}
