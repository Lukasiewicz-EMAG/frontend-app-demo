import { useIntl } from 'react-intl';
import ProblematicIssues from "./components/ProblematicIssues/ProblematicIssues";
import { useState, useEffect } from "react";
import { HttpClient } from "../../utils/httpClient";
import UnsolvedTasks from "./components/UnsolvedTasks";
import { RecommendationData } from "./types";
import { UnfinishedCoursesSection } from './components/UnfinishedCourses';
import SuggestedTasks from './components/SuggestedTasks';

export default function Referral() {
    const intl = useIntl();
    const [data, setData] = useState<RecommendationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const httpClient = new HttpClient('/api');
        httpClient
            .get<RecommendationData>('/student_code/recommendations')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>{intl.formatMessage({ id: 'loading' })}</p>;
    }

    if (!data) {
        return <p>{intl.formatMessage({ id: 'error.no_data' })}</p>;
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold">
                {intl.formatMessage({ id: 'referral.continue_learning' })}
            </h1>

            <UnfinishedCoursesSection courses={data.unfinished_courses} />

            <SuggestedTasks tasks={data.recommendations.tasks_to_train} />


            <ProblematicIssues
                timeBasedTaskRanking={data.recommendations.time_based_task_ranking}
                errorBasedTaskRanking={data.recommendations.error_based_task_ranking}
            />
            <UnsolvedTasks
                unfinished_courses={data.unfinished_courses}
                recommendations={data.recommendations}
            />
        </div>
    );
}
