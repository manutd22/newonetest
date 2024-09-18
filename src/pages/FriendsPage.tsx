import { Section, Cell, Button } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';


export const FriendsPage: FC = () => {
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    const generateReferralLink = async () => {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      if (user) {
        try {
          const response = await axios.get(`${API_BASE_URL}/users/${user.id}/referral-link`);
          setReferralLink(response.data.referralLink);
        } catch (error) {
          console.error('Error generating referral link:', error);
        }
      }
    };

    generateReferralLink();
  }, []);

  const handleShare = () => {
    window.Telegram.WebApp.openTelegramLink(referralLink);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      window.Telegram.WebApp.showAlert('Referral link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      window.Telegram.WebApp.showAlert('Failed to copy referral link');
    }
  };

  return (
    <Section header="Invite Friends">
      <Cell>
        Your referral link: {referralLink}
      </Cell>
      <Button onClick={handleShare}>Share Referral Link</Button>
      <Button onClick={handleCopy}>Copy Referral Link</Button>
    </Section>
  );
};