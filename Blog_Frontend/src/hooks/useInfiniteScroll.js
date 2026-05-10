import { useCallback, useEffect, useRef } from "react";

const useInfiniteScroll = (onLoadMore) => {
  const callbackRef = useRef(onLoadMore);
  const cleanupRef = useRef(null);

  // Keep callbackRef current without recreating the observer
  useEffect(() => {
    callbackRef.current = onLoadMore;
  }, [onLoadMore]);

  // Callback ref: React calls this with the node when the element mounts,
  // and with null when it unmounts. Observer is tied to element lifetime.
  const loaderRef = useCallback((node) => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    if (node) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) callbackRef.current();
      });
      observer.observe(node);
      cleanupRef.current = () => observer.disconnect();
    }
  }, []);

  return loaderRef;
};

export default useInfiniteScroll;
