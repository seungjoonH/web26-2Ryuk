import styles from '@/app/components/helpers/components.module.css';
import { ChatBubbles, ChatConverter } from '@/app/features/chat';
import ChatBubble from '@/app/features/chat/components/ChatBubble';
import PopularPosts from '@/app/features/post/components/PopularPosts';
import PostListRow from '@/app/features/post/components/PostListRow';
import PostListItem from '@/app/features/post/components/PostListItem';
import Component from '@/app/components/helpers/Component';
import ComponentRelations from '@/app/components/helpers/ComponentRelations';
import globalChatMock from '@/mocks/data/globalChat.json';
import postListCardMock from '@/mocks/data/postListCard.json';
import { PostConverter } from '@/app/features/post/dtos/Post';
import GlobalChatModal from '@/app/features/chat/components/GlobalChat.server';
import MicSetting from '@/app/features/room/components/creation/MicSetting';
import PasswordSetting from '@/app/features/room/components/creation/PasswordSetting';
import RoomCreationModal from '@/app/features/room/components/creation/RoomCreationModal';
import RealtimeRoomsSection from '@/app/features/room/components/RealtimeRoomsSection';
import RoomCard from '@/app/features/room/components/card/RoomCard';
import roomsMock from '@/mocks/data/rooms.json';
import { RoomConverter } from '@/app/features/room/dtos/Room';

export default function FeatureComponents() {
  return (
    <>
      <section id="chat-bubble" className={styles.section}>
        <h2 className={styles.sectionTitle}>ChatBubble</h2>
        <ComponentRelations componentId="chat-bubble" />
        <div className={styles.chatRow}>
          <div className={styles.showcaseBlock}>
            <h3 className={styles.blockTitle}>Other User</h3>
            <div className={styles.buttonColumn}>
              <Component>
                <ChatBubble
                  id="1"
                  authorId="1"
                  authorNickname="상대방"
                  isMe={false}
                  message="Their Message"
                  createDate={new Date()}
                  updateDate={new Date()}
                />
              </Component>
            </div>
          </div>
          <div className={styles.showcaseBlock}>
            <h3 className={styles.blockTitle}>Me</h3>
            <div className={styles.buttonColumn}>
              <Component>
                <ChatBubble
                  id="2"
                  authorId="2"
                  authorNickname="나"
                  isMe={true}
                  message="My Message"
                  createDate={new Date()}
                  updateDate={new Date()}
                />
              </Component>
            </div>
          </div>
        </div>
      </section>

      <section id="chat-bubbles" className={styles.section}>
        <h2 className={styles.sectionTitle}>ChatBubbles</h2>
        <ComponentRelations componentId="chat-bubbles" />
        <div className={styles.showcaseBlock}>
          <Component>
            <ChatBubbles chats={globalChatMock.chats.map(ChatConverter.toData)} />
          </Component>
        </div>
      </section>

      <section id="global-chat-modal" className={styles.section}>
        <h2 className={styles.sectionTitle}>GlobalChatModal</h2>
        <ComponentRelations componentId="global-chat-modal" />
        <div className={styles.showcaseBlock}>
          <Component>
            <GlobalChatModal />
          </Component>
        </div>
      </section>

      <section id="post-list-row" className={styles.section}>
        <h2 className={styles.sectionTitle}>PostListRow</h2>
        <ComponentRelations componentId="post-list-row" />
        <div className={styles.showcaseBlock}>
          <h3 className={styles.blockTitle}>Default</h3>
          <div className={styles.buttonColumn}>
            <Component fullWidth>
              <PostListRow
                id="1"
                title="Title"
                content="Content"
                category="free"
                createDate={new Date()}
                updateDate={new Date()}
                viewCount={0}
                likeCount={0}
                commentCount={0}
                authorId="1"
                authorNickname="Author"
                isMe={false}
              />
            </Component>
          </div>
        </div>
      </section>

      <section id="post-list-item" className={styles.section}>
        <h2 className={styles.sectionTitle}>PostListItem</h2>
        <ComponentRelations componentId="post-list-item" />
        <div className={styles.showcaseBlock}>
          <h3 className={styles.blockTitle}>Default</h3>
          <div className={styles.buttonColumn}>
            <Component>
              <PostListItem
                id="1"
                title="Title"
                tags={['#tag1', '#tag2', '#tag3']}
                viewCount={0}
                likeCount={0}
                commentCount={0}
                createDate={new Date()}
              />
            </Component>
          </div>
        </div>
      </section>

      <section id="post-list-items" className={styles.section}>
        <h2 className={styles.sectionTitle}>PostListItems</h2>
        <ComponentRelations componentId="post-list-items" />
        <div className={styles.showcaseBlock}>
          <Component>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {postListCardMock.posts.slice(0, 3).map((post) => {
                const postData = PostConverter.toData(post);
                return (
                  <PostListItem
                    key={postData.id}
                    id={postData.id}
                    title={postData.title}
                    tags={postData.tags}
                    createDate={postData.createDate}
                    updateDate={postData.updateDate}
                    viewCount={postData.viewCount}
                    likeCount={postData.likeCount}
                    commentCount={postData.commentCount}
                  />
                );
              })}
            </ul>
          </Component>
        </div>
      </section>

      <section id="popular-posts-section" className={styles.section}>
        <h2 className={styles.sectionTitle}>PopularPostsSection</h2>
        <ComponentRelations componentId="popular-posts-section" />
        <div className={styles.showcaseBlock}>
          <Component>
            <PopularPosts posts={postListCardMock.posts.map(PostConverter.toData)} viewCount={2} />
          </Component>
        </div>
      </section>

      <section id="mic-setting" className={styles.section}>
        <h2 className={styles.sectionTitle}>MicSetting</h2>
        <ComponentRelations componentId="mic-setting" />
        <div className={styles.showcaseBlock}>
          <Component>
            <MicSetting />
          </Component>
        </div>
      </section>

      <section id="password-setting" className={styles.section}>
        <h2 className={styles.sectionTitle}>PasswordSetting</h2>
        <ComponentRelations componentId="password-setting" />
        <div className={styles.showcaseBlock}>
          <Component>
            <PasswordSetting initialChecked={true} initialPassword="" />
          </Component>
        </div>
      </section>

      <section id="room-creation-modal" className={styles.section}>
        <h2 className={styles.sectionTitle}>RoomCreationModal</h2>
        <ComponentRelations componentId="room-creation-modal" />
        <div className={styles.showcaseBlock}>
          <Component>
            <RoomCreationModal />
          </Component>
        </div>
      </section>

      <section id="room-card" className={styles.section}>
        <h2 className={styles.sectionTitle}>RoomCard</h2>
        <ComponentRelations componentId="room-card" />
        <div className={styles.chatRow}>
          <div className={styles.showcaseBlock}>
            <h3 className={styles.blockTitle}>RoomCard</h3>
            <div className={styles.buttonColumn}>
              <Component>
                <RoomCard
                  id="1"
                  title="Title"
                  tags={['#tag1', '#tag2']}
                  currentParticipants={5}
                  maxParticipants={10}
                  isMicAvailable
                  isPrivate={false}
                  createDate={new Date()}
                  participantProfileImages={[
                    'https://i.pravatar.cc/150?img=1',
                    'https://i.pravatar.cc/150?img=2',
                    'https://i.pravatar.cc/150?img=3',
                    'https://i.pravatar.cc/150?img=4',
                  ]}
                />
              </Component>
            </div>
          </div>
        </div>
      </section>

      <section id="realtime-rooms" className={styles.section}>
        <h2 className={styles.sectionTitle}>RealtimeRoomsSection</h2>
        <ComponentRelations componentId="realtime-rooms" />
        <div className={styles.showcaseBlock}>
          <Component fullWidth>
            <RealtimeRoomsSection rooms={roomsMock.rooms.map(RoomConverter.toData)} />
          </Component>
        </div>
      </section>
    </>
  );
}
