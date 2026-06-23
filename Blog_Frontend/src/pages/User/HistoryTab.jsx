import HistoryContainer from "@/components/user/history/HistoryContainer";

const HistoryTab = () => {
  return (
    <div className="max-w-3xl min-h-screen mx-auto my-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Reading History</h2>
      <HistoryContainer />
    </div>
  );
};

export default HistoryTab;
