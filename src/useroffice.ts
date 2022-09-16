
export interface User {
  firstName: string,
  lastName: string,
  email: string
}

export interface UserOfficeProposal {
  proposalId: number,
  users: User[],
  principalInvestigator: User
}

export class UserOffice {
  userOfficeHost = process.env.USER_OFFICE_HOST ?? "";
  userOfficeJwtToken = process.env.USER_OFFICE_JWT_TOKEN ?? "";

  async getProposal(proposalPk: number) : Promise<UserOfficeProposal> {

    const userOfficeProposal = {} as UserOfficeProposal;

    return userOfficeProposal;
  }

}
