import React, { useId } from 'react';
import styles from '../index.module.css';

export const UseIdDemo: React.FC = () => {
  const nameId = useId();
  const emailId = useId();
  const descriptionId = useId();
  const groupId = useId();

  return (
    <section className={styles.section}>
      <h2>10. useId - 唯一ID生成</h2>
      <div className={styles.idDemo}>
        <h4>表单元素关联:</h4>
        <form className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor={nameId}>姓名:</label>
            <input id={nameId} className={styles.input} />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor={emailId}>邮箱:</label>
            <input id={emailId} type="email" className={styles.input} />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor={descriptionId}>描述:</label>
            <textarea id={descriptionId} className={styles.textarea}></textarea>
          </div>

          <fieldset>
            <legend>性别选择</legend>
            <div className={styles.radioGroup}>
              <input type="radio" id={`${groupId}-male`} name={groupId} value="male" />
              <label htmlFor={`${groupId}-male`}>男</label>

              <input type="radio" id={`${groupId}-female`} name={groupId} value="female" />
              <label htmlFor={`${groupId}-female`}>女</label>
            </div>
          </fieldset>
        </form>

        <div className={styles.idInfo}>
          <h5>生成的唯一ID:</h5>
          <ul>
            <li>
              姓名ID: <code>{nameId}</code>
            </li>
            <li>
              邮箱ID: <code>{emailId}</code>
            </li>
            <li>
              描述ID: <code>{descriptionId}</code>
            </li>
            <li>
              分组ID: <code>{groupId}</code>
            </li>
          </ul>
          <p className={styles.tip}>💡 useId 确保每个表单元素都有唯一的ID，支持服务端渲染</p>
        </div>
      </div>
    </section>
  );
};
