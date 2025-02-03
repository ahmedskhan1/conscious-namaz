import Accordion from "../../Accordion"
import Animate from "../../Animate"
import Style from "./HomeFaq.module.css"

const HomeFaq = () => {
  return (
    <section className={`py-10 pb-14 lg:pb-28 ${Style.root}`} id="faq">
      <div className="px-5 mx-auto max-w-[1086px]">
        <Animate as="h2" className="mb-10 lg:mb-14 h2 text-center">Frequently asked Questions</Animate>
        <Animate className="space-y-2">
          <Accordion
            title="How would conscious Namaz help me?"
            isOpen={true}
          >
            As the contemporary way of subconsciously reciting and offering Namaz barely touches the spirit, being extremely present while reciting every verse and absorbing the vibration of every Aayah makes a world of a difference in our mind body and spirit. Whatever “halaal” you desire shall be brought into your world by the powerful laws of nature Allah has created, only if you surrender your mind to emptiness and let Allah shower upon you wealth, health, prosperity and happiness.
          </Accordion>
          <Accordion
            title="What would be the time frame and the procedure for this course?"
          >
            The course consists of six sessions, requiring your dedication for three consecutive days. Each day, there will be a one-hour session at 2:00 AM (Tahajjud time) and another at 8:30 PM, making it two sessions per day. The course is typically held on Monday, Tuesday, and Wednesday
            <table>
              <tbody>
                <tr>
                  <td>0830 PM (IST)</td>
                  <td>Live session</td>
                </tr>
                <tr>
                  <td>0200 AM (IST)</td>
                  <td>Tahajjud Namaz & <br /> Meditation</td>
                </tr>
              </tbody>
            </table>
          </Accordion>
          <Accordion
            title="Is any prior experience needed before joining any course?"
          >
            If you are a Muslim and have been praying and offering Namaz for a long time, this course would bring about a powerful change in your life. If you are unaware of the basics of offering Namaz, we have a special way of helping you manifest all that you desire using the power of Conscious Namaz.
          </Accordion>
          <Accordion
            title="Can I join this course if I am a non-Muslim?"
          >
            You are more than welcome to join our course and reap maximum benefit from the power of Quranic verses and conscious praying. We believe Conscious Namaz is a tool for every being on this planet irrespective of their caste or religion.
          </Accordion>
          <Accordion
            title="How often is the Tahajjud Namaz program conducted?"
          >
            This course is currently conducted once a week starting Monday and goes on till Wednesday.
          </Accordion>
          <Accordion
            title="What are the Refund Policies if I like to withdraw from any course?"
          >
            <p>Cancellation Window: Clients can cancel any booked session up to 24 hours in advance for a full refund. Cancellations made after the session will not be refunded but can be rescheduled for another free session (if it is a group session). </p>
            <p>Satisfaction Guarantee: If a client is unsatisfied with their first session, they are eligible for a 50% refund or a free rescheduled session. Subsequent sessions are not eligible for refunds after completion.</p>
            <p>Package Refunds: For multi-session packages, clients can receive a prorated refund for unused sessions if they decide to discontinue, as long as the request is made within 15 days of purchase.</p>
            <p>All the refunds will take a process of seven working days</p>
          </Accordion>
          <Accordion
            title="If I don’t understand English very well, can I enrol for any other language?"
          >
            We would love to get a feedback on different language requests. We will surely consider creating a program in your desired language. Feel free to write to us on info@consciousnamaz.com
          </Accordion>
          <Accordion
            title="Would this course be pre-recorded or hosted Live?"
          >
            All the six sessions will be hosted Live. The evening sessions will be conducted for building a deeper understanding of praying consciously and its power followed by Question and answers if any. The midnight 2 am sessions are mainly offering the Tahajjud Namaz being fully conscious followed by a powerful Islamic guided meditation.
          </Accordion>
          <Accordion
            title="Will there be any assistance provided post the course completion?"
          >
            Once you complete any course with us, you become a part of the Conscious Namaz community. We are more than happy to offer any assistance that is needed.
          </Accordion>
        </Animate>
      </div>
    </section>
  )
}

export default HomeFaq