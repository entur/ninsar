import {
  FetchError,
  LineStatisticsPerProviderId,
} from './lineStatistics.response.types';
import { useEffect, useState } from 'react';
import { Validity } from '../lineStatistics.types';
import { useAuth } from '../../appContext';

type Type = () => {
  lineStatisticsForAllProviders: LineStatisticsPerProviderId;
  loading: boolean;
  error: FetchError | null;
};

const GRAPHQL_ENDPOINT = process.env.REACT_APP_KILILI_API_URL;

const LINE_STATISTICS_QUERY = `
  query {
    lineStatistics {
        providerId
        providerName
        startDate
        days
        validityCategories {
          name
          numDaysAtLeastValid
          lineNumbersCount
        }
      }
    }
`;

export const useLineStatisticsForAllProviders: Type = () => {
  const { getToken } = useAuth();
  const [lineStatisticsForAllProviders, setLineStatisticsForAllProviders] =
    useState<LineStatisticsPerProviderId>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FetchError | null>(null);

  useEffect(() => {
    const fetchLineStatistics = async () => {
      try {
        setLoading(true);

        const response = await fetch(GRAPHQL_ENDPOINT!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getToken!()}`,
            'Et-Client-Name': 'entur-ninsar',
          },
          body: JSON.stringify({
            query: LINE_STATISTICS_QUERY,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `GraphQL request failed with status ${response.status}`,
            {
              cause: {
                status: response.status,
                statusText: response.statusText,
              },
            },
          );
        }

        const { data, errors } = await response.json();

        if (errors) {
          throw new Error(errors.map((e: any) => e.message).join(', '), {
            cause: {
              status: response.status,
              statusText: errors.map((e: any) => e.message).join(', '),
            },
          });
        }

        // Transform the response into the expected format
        const transformedData: LineStatisticsPerProviderId = {};

        data.lineStatistics.forEach((lineStatistics: any) => {
          const { providerId } = lineStatistics;

          if (lineStatistics) {
            // Convert validityCategories to a Map
            const validityCategories = new Map();
            let sum = 0;
            lineStatistics.validityCategories.forEach((category: any) => {
              validityCategories.set(category.name, category.lineNumbersCount);
              sum += category.lineNumbersCount;
            });

            validityCategories.set(Validity.ALL, sum);

            // Since we don't have publicLines in the query, create an empty linesMap
            const linesMap: { [lineNumber: string]: any } = {};

            // Add the transformed data to the result
            transformedData[providerId.toString()] = {
              providerName: lineStatistics.providerName,
              startDate: lineStatistics.startDate,
              endDate: new Date(
                new Date(lineStatistics.startDate).getTime() +
                  lineStatistics.days * 24 * 60 * 60 * 1000,
              )
                .toISOString()
                .split('T')[0],
              requiredValidityDate: new Date().toISOString().split('T')[0], // Current date as a placeholder
              linesMap,
              validityCategories,
              validityCategoriesCount: validityCategories,
            };
          }
        });

        setLineStatisticsForAllProviders(transformedData);
      } catch (err) {
        setError((err as Error).cause as FetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchLineStatistics();
  }, []);

  return {
    lineStatisticsForAllProviders,
    loading,
    error,
  };
};
