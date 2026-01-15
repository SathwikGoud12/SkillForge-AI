import TopicServices from "../appwrite/TopicServices";
const topicService = new TopicServices();
class TopicsQueries{
  getTopicsByDomainQuery = (domainId) => ({
  queryKey: ["topics", domainId],
  queryFn: () => topicService.getTopicsByDomain(domainId),
});
}
export  default TopicsQueries;