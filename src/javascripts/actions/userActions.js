// action types

export const GET_NAV_BAR_TODOS = 'GET_NAV_BAR_TODOS';
export const GET_HOSPITAL_SHIFTS = 'GET_HOSPITAL_SHIFTS';
export const GET_APPROVED_SHIFTS = 'GET_APPROVED_SHIFTS';
export const GET_PENDING_SHIFTS = 'GET_PENDING_SHIFTS';

export function getNavTodos(todos) {
  return {
    type: GET_NAV_BAR_TODOS,
    todos,
  };
}

export function getHospitalShifts(shifts) {
  return {
    type: GET_HOSPITAL_SHIFTS,
    shifts,
  };
}

export function getApprovedShifts(shifts) {
  return {
    type: GET_APPROVED_SHIFTS,
    shifts,
  };
}

export function getPendingShifts(shifts) {
  return {
    type: GET_PENDING_SHIFTS,
    shifts,
  };
}
