import { getSuggestionActions } from './getSuggestionActions';

const none = {
  canReview: false,
  canEdit: false,
  canModerate: false,
  canDeleteOwn: false,
  isOwn: false,
  activeCount: 3,
};

describe('getSuggestionActions', () => {
  it('offers nothing without permissions', () => {
    expect(getSuggestionActions(none)).toEqual({
      accept: false,
      acceptAndDeclineOthers: false,
      decline: false,
      delete: false,
    });
  });

  it('reviewer without edit can only decline', () => {
    expect(getSuggestionActions({ ...none, canReview: true })).toEqual({
      accept: false,
      acceptAndDeclineOthers: false,
      decline: true,
      delete: false,
    });
  });

  it('edit without review cannot accept', () => {
    expect(getSuggestionActions({ ...none, canEdit: true }).accept).toBe(false);
  });

  it('reviewer with edit can accept; decline others only when there are others', () => {
    const params = { ...none, canReview: true, canEdit: true };
    expect(getSuggestionActions(params).acceptAndDeclineOthers).toBe(true);
    expect(getSuggestionActions({ ...params, activeCount: 1 })).toMatchObject({
      accept: true,
      acceptAndDeclineOthers: false,
    });
  });

  it('own-access deletes only own suggestions', () => {
    const params = { ...none, canDeleteOwn: true };
    expect(getSuggestionActions(params).delete).toBe(false);
    expect(getSuggestionActions({ ...params, isOwn: true }).delete).toBe(true);
    expect(
      getSuggestionActions({ ...none, isOwn: true, canDeleteOwn: false }).delete
    ).toBe(false);
  });

  it('moderator deletes anyone’s suggestion', () => {
    expect(getSuggestionActions({ ...none, canModerate: true }).delete).toBe(
      true
    );
  });
});
