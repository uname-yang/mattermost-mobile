// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {intlShape} from 'react-intl';

export default class NotificationSettingsMentionsBase extends PureComponent {
    static propTypes = {
        currentUser: PropTypes.object.isRequired,
        intl: intlShape.isRequired,
        navigator: PropTypes.object,
        onBack: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        const {currentUser} = props;
        const notifyProps = currentUser.notify_props || {};

        props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);

        this.goingBack = true; //use to identify if the navigator is popping this screen
        this.setStateFromNotifyProps(notifyProps);
    }

    onNavigatorEvent = (event) => {
        if (event.type === 'ScreenChangedEvent' && this.goingBack) {
            switch (event.id) {
            case 'willDisappear':
                this.saveUserNotifyProps();
                break;
            }
        }
    };

    setStateFromNotifyProps = (notifyProps) => {
        const mentionKeys = (notifyProps.mention_keys || '').split(',');
        const usernameMentionIndex = mentionKeys.indexOf(this.props.currentUser.username);
        if (usernameMentionIndex > -1) {
            mentionKeys.splice(usernameMentionIndex, 1);
        }

        const comments = notifyProps.comments || 'never';

        const newState = {
            ...notifyProps,
            comments,
            usernameMention: usernameMentionIndex > -1,
            mention_keys: mentionKeys.join(','),
            showKeywordsModal: false,
            showReplyModal: false
        };

        this.keywords = newState.mention_keys;
        this.replyValue = comments;
        this.state = {...newState};
    };

    toggleFirstNameMention = () => {
        this.setState({
            first_name: (!(this.state.first_name === 'true')).toString()
        });
    };

    toggleUsernameMention = () => {
        this.setState({
            usernameMention: !this.state.usernameMention
        });
    };

    toggleChannelMentions = () => {
        this.setState({
            channel: (!(this.state.channel === 'true')).toString()
        });
    };

    updateMentionKeys = (text) => {
        this.goingBack = true;
        this.setState({
            mention_keys: text,
            showKeywordsModal: false
        });
    };

    setReplyNotifications = (value) => {
        this.setState({
            comments: value,
            showReplyModal: false
        });
    };

    saveUserNotifyProps = () => {
        let {mention_keys: mentionKeys, usernameMention, ...notifyProps} = this.state; //eslint-disable-line prefer-const

        if (mentionKeys.length > 0) {
            mentionKeys = mentionKeys.split(',').map((m) => m.replace(/\s/g, ''));
        } else {
            mentionKeys = [];
        }

        if (usernameMention) {
            mentionKeys.push(`${this.props.currentUser.username}`);
        }

        mentionKeys = mentionKeys.join(',');
        Reflect.deleteProperty(notifyProps, 'showKeywordsModal');
        Reflect.deleteProperty(notifyProps, 'showReplyModal');

        this.props.onBack({
            ...notifyProps,
            mention_keys: mentionKeys,
            user_id: this.props.currentUser.id
        });
    };
}
