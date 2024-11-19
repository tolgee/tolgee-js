import { Alert, AlertTitle, Box } from '@mui/material';
import { useDialogContext } from '../dialogContext';
import { MissingTagsList } from './MissingTagsList';

export const FilterTagMissingInfo = () => {
  const filterTag = useDialogContext((c) => c.uiProps.filterTag);
  const filterTagMissing = useDialogContext((c) => c.filterTagMissing);

  if (!filterTagMissing) {
    return null;
  }

  if (filterTag)
    return (
      <Alert severity="error" sx={{ mt: 1, mb: 1, fontSize: 15 }}>
        <AlertTitle>Missing Required Tag</AlertTitle>
        {filterTag.length > 1 ? (
          <Box>
            This app is configured to use only keys tagged with the{' '}
            <MissingTagsList tags={filterTag} />. Add one of them to continue.
          </Box>
        ) : (
          <Box>
            This app is configured to use only keys tagged with the{' '}
            <MissingTagsList tags={filterTag} />. Add this tag to continue.
          </Box>
        )}
        <Box mt={1}>
          <a
            href="https://docs.tolgee.io/js-sdk/filter_by_tags"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read more in the docs
          </a>
        </Box>
      </Alert>
    );
};
