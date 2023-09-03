import { Octokit } from '@octokit/core';
import * as os from 'os';

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

let orgUsername: string = '';

/**
 * Set an organization name to manage a member.
 * 
 * @param username - A GitHub organization username
 */
export const organization = (username: string) => {
  orgUsername = username;
};

/**
 * Add a member to the organization by specific GitHub username.
 * 
 * @param username - A GitHub username
 */
export const member = async (username: string) => {
  await addMember(username, 'member');
};

/**
 * Add a admin to the organization by specific GitHub username.
 * 
 * @param username - A GitHub username
 */
export const admin = async (username: string) => {
  await addMember(username, 'admin');
};

const addMember = async (username: string, role: 'member' | 'admin') => {
  try {
    await octokit.request('PUT /orgs/{org}/memberships/{username}', {
      org: orgUsername,
      username: username,
      role: role,
    });
  } catch (error: Error | unknown) {
    if (!(error instanceof Error)) return;
    setFailed(`${error.message} (username: ${username})`);
  }
};

export const setFailed = (message: string) => {
  process.exitCode = 1;
  process.stdout.write(message + os.EOL);
};
