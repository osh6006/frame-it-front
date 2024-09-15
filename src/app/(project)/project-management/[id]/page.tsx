'use client';

import BottomButton from '@/components/common/bottom-button';
import Guide from '@/components/common/guide';
import Icon from '@/components/common/icon';
import ProjectProgress from '@/components/project/project-progress';
import useDisclosure from '@/hooks/useDisclosure';
import { cn } from '@/lib/utils';
import { IProject } from '@/types/project';
import { faker } from '@faker-js/faker/locale/ko';

const ProjectManagementDetailPage = () => {
  // TODO: query string으로 state 받아서 처리
  // TODO: host, guest 구분
  const project: IProject = {
    id: '1',
    date: '7/31',
    time: '12:00~14:00',
    location: '서울시 종로구',
    state: 'recruiting',
    title: '노들섬에서 촬용해 주세요',
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-4">
      <ProjectInfo project={project} />
      <div className={cn('flex flex-col gap-2')}>
        <h1 className={cn('font-title-18 text-gray-20')}>진행상황</h1>
        <ProgressBox state={project.state} />
      </div>
      <ApplicantList />
      <div className="flex flex-col gap-2">
        <h1 className={cn('font-title-18 text-gray-20')}>프로젝트 조정</h1>
        <Guide
          title="프로젝트 안내"
          guides={[
            `프레이밋의 모든 프로젝트는 ‘상호무페이’입니다. 호스트가 돈을 요구하는 등 정책에 위반하는 행위를 하는 경우, 프레이밋 이메일(2024.frameit@gmail.com)로 신고해 주세요.`,
            `프로젝트는 [모집 중 - 진행 중 - 완료] 로 진행됩니다.`,
            `프로젝트를 완료 즉시, 상대방에게 리뷰를 남길 수 있습니다.`,
          ]}
          collapsible
        />
        <Guide
          title="프로젝트 취소 안내"
          guides={[
            `모집 중인 프로젝트는 신청을 취소할 수 있습니다.`,
            `진행 중인 프로젝트를 취소하고 싶은 경우, 취소하고 싶은 프로젝트의 제목, 호스트 닉네임, 게스트 닉네임과 취소사유를 적어 프레이밋 이메일(2024.frameit@gmail.com)로 접수해주세요.`,
            `취소 접수 동안은 ‘진행 중’ 상태를 유지합니다.`,
            `취소된 프로젝트는 ‘취소’ 상태로 변경됩니다.`,
          ]}
          collapsible
        />
      </div>
    </div>
  );
};

const ProjectInfo = ({ project }: { project: Omit<IProject, 'state'> }) => {
  return (
    <div className="flex flex-col gap-1 rounded-[8px] bg-gray-90 px-[12px] py-[14px]">
      <h2 className="font-title-18 text-gray-10">프로젝트</h2>
      <h2 className="font-body-14m text-gray-10">{project.title}</h2>
      <div className="flex items-center">
        <p
          className={cn(
            'font-tag-14 text-gray-40 after:mx-[6px] after:content-["|"]',
          )}
        >
          {project.location}
        </p>
        <p
          className={cn(
            'font-tag-14 text-gray-40 after:mx-[6px] after:content-["|"]',
          )}
        >
          {project.date}
        </p>
        <p className={cn('font-tag-14 text-gray-40 after:mx-[6px]')}>
          {project.time}
        </p>
      </div>
    </div>
  );
};

const ProgressBox = ({ state }: { state: IProject['state'] }) => {
  return (
    <div
      className={cn(
        'flex h-[80px] justify-center rounded-[8px] border border-gray-80 pt-[26px]',
      )}
    >
      <ProjectProgress state={state} />
    </div>
  );
};

const ApplicantList = () => {
  const { isOpen, onToggle } = useDisclosure(false);
  const applicants = Array.from({ length: 3 }).map(() => ({
    profileImage: faker.image.avatar(),
    name: faker.name.fullName(),
    applicationDate: faker.date.recent().toISOString().split('T')[0],
    content: faker.lorem.sentence(),
  }));
  return (
    <div className={cn('flex w-full flex-col')}>
      <div className={cn('flex w-full justify-between')}>
        <h1 className={cn('font-title-18 text-gray-20')}>신청자 리스트</h1>
        <Icon
          id={isOpen ? 'arrow-up-icon' : 'arrow-down-icon'}
          size={24}
          onClick={onToggle}
          className={cn('text-gray-40')}
        />
      </div>
      {isOpen && (
        <div className="mt-4 flex-1 space-y-4">
          {applicants.map((applicant, index) => (
            <ApplicantListItem
              key={index}
              profileImage={applicant.profileImage}
              name={applicant.name}
              applicationDate={applicant.applicationDate}
              content={applicant.content}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ApplicantListItemProps {
  profileImage: string;
  name: string;
  applicationDate: string;
  content: string;
}

const ApplicantListItem: React.FunctionComponent<ApplicantListItemProps> = ({
  profileImage,
  name,
  applicationDate,
  content,
}) => {
  return (
    <div className="flex gap-4 rounded-[8px] border border-gray-80 p-4">
      <div className="flex-shrink-0">
        <img
          src={profileImage}
          alt={`${name}'s profile`}
          className="h-[46px] w-[46px] rounded-[8px] object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 justify-between">
          <h3 className="font-body-14m text-gray-20">{name}</h3>
          <span className="font-caption-12 text-gray-40">
            신청일 {applicationDate}
          </span>
        </div>
        <p className="font-body-14 mb-2 mt-1 text-gray-40">{content}</p>
        <div className="flex gap-[6px]">
          <BottomButton
            variant="stroke"
            size="small"
            label={'DM'}
            className="font-tag-12 max-w-none flex-1"
          />
          <BottomButton
            variant="secondary"
            size="small"
            label={'프로젝트 시작하기'}
            className="font-tag-12 max-w-none flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectManagementDetailPage;
