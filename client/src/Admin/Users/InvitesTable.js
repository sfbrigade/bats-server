import React, { useContext, useEffect, useState } from 'react';

import ApiService from '../../ApiService';
import Alert from '../../Components/Alert';
import Spinner from '../../Components/Spinner';
import Context from '../../Context';

function InvitesTable() {
  const { user, organization } = useContext(Context);
  const [invites, setInvites] = useState();

  const [selectedInvite, setSelectedInvite] = useState();
  const [isConfirmResendShowing, setConfirmResendShowing] = useState(false);
  const [isResendCompleteShowing, setResendCompleteShowing] = useState(false);
  const [isConfirmRevokeShowing, setConfirmRevokeShowing] = useState(false);

  useEffect(() => {
    if (user && organization) {
      const params = { organizationId: organization?.id };
      ApiService.invites.index(params).then((response) => {
        setInvites(response.data);
      });
    }
  }, [user, organization]);

  function onResend(invite) {
    setSelectedInvite(invite);
    setConfirmResendShowing(true);
  }

  async function onResendConfirmed() {
    setConfirmResendShowing(false);
    try {
      await ApiService.invites.resend(selectedInvite?.id);
      setResendCompleteShowing(true);
      setSelectedInvite();
    } catch (err) {
      console.log(err);
    }
  }

  function onRevoke(invite) {
    setSelectedInvite(invite);
    setConfirmRevokeShowing(true);
  }

  async function onRevokeConfirmed() {
    setConfirmRevokeShowing(false);
    try {
      await ApiService.invites.revoke(selectedInvite?.id);
      const newInvites = [...invites];
      newInvites.splice(newInvites.indexOf(selectedInvite), 1);
      setInvites(newInvites);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <table className="usa-table usa-table--striped usa-table--hoverable usa-table--borderless width-full">
        <thead>
          <tr>
            <th className="w-20">First Name</th>
            <th className="w-20">Last Name</th>
            <th className="w-40">Email</th>
            <th className="w-20" />
          </tr>
        </thead>
        <tbody>
          {invites?.map((i) => (
            <tr key={i.id}>
              <td>{i.firstName}</td>
              <td>{i.lastName}</td>
              <td>{i.email}</td>
              <td>
                <button className="usa-button usa-button--unstyled" onClick={() => onResend(i)}>
                  Resend
                </button>{' '}
                |{' '}
                <button className="usa-button usa-button--unstyled" onClick={() => onRevoke(i)}>
                  Revoke
                </button>
              </td>
            </tr>
          ))}
          {invites?.length === 0 && (
            <tr>
              <td colSpan={4}>No invites yet.</td>
            </tr>
          )}
          {!invites && (
            <tr>
              <td colSpan={4}>
                <Spinner size="sm" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isConfirmResendShowing && (
        <Alert
          type="warning"
          primary="Yes"
          cancel="No"
          onCancel={() => setConfirmResendShowing(false)}
          onPrimary={() => onResendConfirmed()}
        >
          Are you sure you wish to resend the invitation to <b>{selectedInvite?.email}</b>?
        </Alert>
      )}
      {isResendCompleteShowing && (
        <Alert type="success" cancel="OK" onCancel={() => setResendCompleteShowing(false)}>
          Invite resent to <b>{selectedInvite?.email}</b>!
        </Alert>
      )}
      {isConfirmRevokeShowing && (
        <Alert
          type="error"
          destructive="Yes"
          cancel="No"
          onCancel={() => setConfirmRevokeShowing(false)}
          onDestructive={() => onRevokeConfirmed()}
        >
          Are you sure you wish to revoke the invitation to <b>{selectedInvite?.email}</b>?
        </Alert>
      )}
    </>
  );
}

export default InvitesTable;
