import axiosRequest from "./request";

const Exchange_Rate = '/api/v1/exchange-rate';


export const getExchange = (token) => axiosRequest("get", "/api/v1/exchange-rate");

// export const getTeams = () => axiosRequest("get", "/teams");
// export const getSingleTeam = (id) => axiosRequest("get", `/team/${id}`);
// export const getCompetitions = (params) =>
//   axiosRequest("get", `/competitions?${params}`);
// export const getMatches = (params) => axiosRequest("get", `/matches?${params}`);
// export const getFormation = (match_id) =>
//   axiosRequest("get", `/matches/lineups?match_id=${match_id}`);
// export const getHeadToHead = ({ teamA, teamB }) =>
//   axiosRequest(
//     "get",
//     `/matches/headtohead?page=1&limit=20&headA_team_id=${teamA}&headB_team_id=${teamB}`
//   );

