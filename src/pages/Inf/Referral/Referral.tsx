import { useQuery } from '@tanstack/react-query';
import { useIntl } from 'react-intl';
import { Loader } from '../../../components/Loader/Loader';
import ProblematicIssues from '../../../components/ProblematicIssues/ProblematicIssues';
import SuggestedTasks from '../../../components/SuggestedTasks/SuggestedTasks';
import { UnfinishedCoursesSection } from '../../../components/UnfinishedCourses/UnfinishedCourses';
import UnsolvedTasks from '../../../components/UnsolvedTasks/UnsolvedTasks';
import { HttpClient } from '../../../utils/httpClient';
import { RecommendationData } from './types';

const fetchReferral = async (): Promise<RecommendationData> => {
  const httpClient = new HttpClient('/api');
  const response = await httpClient.get<RecommendationData>('/student_code/recommendations');
  return response.data;
};

export const InfReferral = () => {
  const intl = useIntl();
  const { data, isLoading, error } = useQuery<RecommendationData, Error>({
    queryKey: ['recommendations-inf'],
    queryFn: fetchReferral,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p>{intl.formatMessage({ id: 'error.no_data' })}</p>;
  }

  return (
    <>
      <h1 className='text-3xl font-bold'>{intl.formatMessage({ id: 'referral.continue_learning' })}</h1>

      <UnfinishedCoursesSection courses={data.unfinished_courses} />

      <SuggestedTasks tasks={data.recommendations.tasks_to_train} />

      <ProblematicIssues
        timeBasedTaskRanking={data.recommendations.time_based_task_ranking}
        errorBasedTaskRanking={data.recommendations.error_based_task_ranking}
      />
      <UnsolvedTasks unfinished_courses={data.unfinished_courses} recommendations={data.recommendations} />
    </>
  );
};
