type Params = {
  canReview: boolean;
  canEdit: boolean;
  canModerate: boolean;
  canDeleteOwn: boolean;
  isOwn: boolean;
  activeCount: number;
};

export const getSuggestionActions = ({
  canReview,
  canEdit,
  canModerate,
  canDeleteOwn,
  isOwn,
  activeCount,
}: Params) => {
  const accept = canReview && canEdit;
  return {
    accept,
    acceptAndDeclineOthers: accept && activeCount > 1,
    decline: canReview,
    delete: canModerate || (canDeleteOwn && isOwn),
  };
};
