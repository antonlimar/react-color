export const CHANGE_COLOR = 'APP/CHANGE_COLOR';

export type AppState = {
  color: string;
};

export type ChangeColorAction = {
  type: typeof CHANGE_COLOR;
  hex: string;
};

export type AppAction = ChangeColorAction;

export const actions = {
  changeColor: ({ hex }: { hex: string }): ChangeColorAction => ({ type: CHANGE_COLOR, hex }),
};

const initialState: AppState = {
  color: '#F5A623',
};

export const reducer = (
  state: AppState = initialState,
  action: AppAction,
): AppState => {
  switch (action.type) {
    case CHANGE_COLOR:
      return { ...state, color: action.hex };
    default:
      return state;
  }
};
