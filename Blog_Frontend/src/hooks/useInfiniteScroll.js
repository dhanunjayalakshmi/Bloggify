import { useEffect } from "react";

const useInfiniteScroll = (ref, onLoadMore) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) onLoadMore();
    });
    const currenVal = ref?.current;
    if (currenVal) observer.observe(currenVal);
    return () => {
      if (currenVal) observer?.unobserve(currenVal);
    };
  }, [ref, onLoadMore]);
};

export default useInfiniteScroll;
