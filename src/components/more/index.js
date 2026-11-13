import { createElement } from 'preact';
import { withIntl } from '../../enhancers';
import { useContext, useCallback } from 'preact/hooks';
import { Text, IntlContext } from '@zimbra/preact-i18n';
import style from './style.less';
import { Button } from '@zimbra-client/blocks';
import { OAuthClient } from '@zimbra/oauth-client';

const CreateMore = ({ context, ...props }) => {
	const childIcon = <span class={style.appIcon}></span>;

	const { intl } = useContext(IntlContext);
	const zimletStrings = intl.dictionary['zimbra-zimlet-nextcloud-talk'];

	const handleClick = useCallback(() => {
		// https://nextcloud-talk.readthedocs.io/en/latest/conversation/#creating-a-new-conversation):
		const oauthClient = new OAuthClient(context);
		oauthClient.getInfo('nextcloud').then(info => {
			const NextcloudApiURL = info.nextcloud_url.replace(
				'index.php',
				'ocs/v2.php/apps/spreed/api/v4/room'
			);
			const NextcloudCallURL = info.nextcloud_url.replace('index.php', 'index.php/call/');
			let title = props.event.name ? props.event.name : zimletStrings.meetingTitle;

			let fakeEmailData = {};
			fakeEmailData.nextcloudAction = 'createTalkConv';
			fakeEmailData.body = { roomType: 3, roomName: title };
			fakeEmailData.NextcloudApiURL = NextcloudApiURL;
			fakeEmailData.nextcloudPath = '/';
			fakeEmailData.nextcloudDAVPath = '';
			var request = new XMLHttpRequest();
			var url = '/service/extension/nextcloud';
			var formData = new FormData();
			formData.append('jsondata', JSON.stringify(fakeEmailData));
			request.open('POST', url);
			request.onreadystatechange = function () {
				if (request.readyState === 4) {
					if (request.status === 200) {
						const OCSResponse = JSON.parse(request.responseText);

						//handleLocationChange is a method passed (via props) to the Zimlet slot that allows you to set the location of the appointment
						props.handleLocationChange({
							value: [NextcloudCallURL + OCSResponse.ocs.data.token]
						});
					}
					if (request.status === 400) {
						const OCSResponse = JSON.parse(request.responseText);
						console.error('Error creating Nextcloud Talk conversation:', OCSResponse);
					}
				}
			};
			request.send(formData);
		});
	}, [context, props, zimletStrings.meetingTitle]);

	return (
		<Button class={style.button} onClick={handleClick} brand="primary">
			{childIcon}
			<Text id={`zimbra-zimlet-nextcloud-talk.title`} />
		</Button>
	);
};

export default withIntl()(CreateMore);
