import { createActionType, createPromiseTypes } from './lib';

export const GET_DATA = createPromiseTypes([], 'GET_DATA');
export const CLEAR_DATA = createActionType([], 'CLEAR_DATA');
export const TOGGLE_DATA_IS_EXPANDED = createActionType(
    [],
    'TOGGLE_DATA_IS_EXPANDED'
);
export const SET_SEARCH_QUERY = createActionType([], 'SET_SEARCH_QUERY');
export const RESET_SEARCH_QUERY = createActionType([], 'RESET_SEARCH_QUERY');
