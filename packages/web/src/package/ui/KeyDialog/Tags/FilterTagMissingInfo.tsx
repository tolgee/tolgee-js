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
        <AlertTitle>Missing Filtered Tag</AlertTitle>
        {filterTag.length > 1 ? (
          <Box>
            This app is configured to use only keys tagged with the{' '}
            <MissingTagsList tags={filterTag} /> with the "filterTag" option. To
            use the selected key in this app, add at least one of the filtered
            tags or use another key name in the code.
          </Box>
        ) : (
          <Box>
            This app is configured to use only keys tagged with the{' '}
            <MissingTagsList tags={filterTag} /> with the "filterTag" option. To
            use the selected key in this app, add the tag or use another key
            name in the code.
          </Box>
        )}
        <Box mt={1}>Read more in the docs.</Box>
      </Alert>
    );
};
